require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const {
    GoogleGenerativeAI,
} = require(
    "@google/generative-ai"
);

const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );

const model =
    genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
    });
console.log(
    "Gemini Key Loaded:",
    !!process.env.GEMINI_API_KEY
);
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

/* =========================
   MULTER CONFIGURATION
========================= */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });

app.use(
    "/uploads",
    express.static("uploads")
);

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
    res.send("TravelMate Backend Running");
});

/* =========================
   SIGNUP
========================= */

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword =
            await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        db.query(
            sql,
            [
                name,
                email,
                hashedPassword,
            ],
            (err) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: "Signup Failed",
                    });
                }

                res.status(201).json({
                    message:
                        "User Registered Successfully",
                });
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Signup Failed",
        });
    }
});

/* =========================
   LOGIN
========================= */

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email = ?";

    db.query(
        sql,
        [email],
        async (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Login Failed",
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    message: "Invalid Email or Password",
                });
            }

            const user = result[0];

            const isMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid Email or Password",
                });
            }

            res.json({
                message: "Login Successful",
                user,
            });
        }
    );
});


/* =========================
   FORGOT PASSWORD
========================= */

app.post("/forgot-password", async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        const sql =
            "UPDATE users SET password = ? WHERE email = ?";

        db.query(
            sql,
            [hashedPassword, email],
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Password Reset Failed",
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message: "Email Not Found",
                    });
                }

                res.json({
                    message:
                        "Password Updated Successfully",
                });
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Password Reset Failed",
        });
    }
});

/* =========================
   CREATE TRIP
========================= */

app.post(
    "/create-trip",
    upload.single("tripImage"),
    (req, res) => {
        const {
            destination,
            startDate,
            endDate,
            budget,
            interests,
            description,
            userId,
        } = req.body;

        const tripImage =
            req.file
                ? `/uploads/${req.file.filename}`
                : null;

        const sql = `
      INSERT INTO trips
      (
     destination,
start_date,
end_date,
budget,
interests,
description,
trip_image,
user_id
      )
VALUES (?, ?, ?, ?, ?, ?, ?, ?)    `;
        db.query(
            sql,
            [
                destination,
                startDate,
                endDate,
                budget,
                interests,
                description,
                tripImage,
                userId,
            ],
            (err) => {
                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message:
                            "Trip Creation Failed",
                    });
                }

                res.status(201).json({
                    message:
                        "Trip Created Successfully",
                });
            }
        );
    }
);

/* =========================
   GET ALL TRIPS
========================= */

app.get("/trips", (req, res) => {
    const sql =
        "SELECT * FROM trips ORDER BY id DESC";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to Fetch Trips",
            });
        }

        res.json(result);
    });
});

/* =========================
   UPDATE TRIP
========================= */

app.put("/trip/:id", (req, res) => {
    const { id } = req.params;

    const {
        destination,
        startDate,
        endDate,
        budget,
        interests,
        description,
    } = req.body;

    const sql = `
    UPDATE trips
    SET destination=?,
        start_date=?,
        end_date=?,
        budget=?,
        interests=?,
        description=?
    WHERE id=?
  `;

    db.query(
        sql,
        [
            destination,
            startDate,
            endDate,
            budget,
            interests,
            description,
            id,
        ],
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Update Failed",
                });
            }

            res.json({
                message: "Trip Updated Successfully",
            });
        }
    );
});

/* =========================
   DELETE TRIP
========================= */

app.delete("/trip/:id", (req, res) => {
    const { id } = req.params;

    const sql =
        "DELETE FROM trips WHERE id = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({
                message: "Delete Failed",
            });
        }

        res.json({
            message: "Trip Deleted Successfully",
        });
    });
});

/* =========================
   SEND JOIN REQUEST
========================= */

app.post("/request-trip", (req, res) => {
    const { tripId, senderName } = req.body;

    const sql =
        "INSERT INTO trip_requests (trip_id, sender_name) VALUES (?, ?)";

    db.query(
        sql,
        [tripId, senderName],
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Request Failed",
                });
            }

            const getTripOwnerSql =
                "SELECT user_id FROM trips WHERE id = ?";

            db.query(
                getTripOwnerSql,
                [tripId],
                (ownerErr, ownerResult) => {
                    if (ownerErr) {
                        console.log(ownerErr);
                        return;
                    }

                    const ownerId =
                        ownerResult[0]?.user_id;
                    if (!ownerId) {
                        return;
                    }

                    const notificationSql =
                        `
      INSERT INTO notifications
      (message, user_id)
      VALUES (?, ?)
    `;

                    const notificationMessage =
                        `${senderName} sent a trip request`;

                    db.query(
                        notificationSql,
                        [
                            notificationMessage,
                            ownerId,
                        ]
                    );
                }
            );

            res.json({
                message:
                    "Request Sent Successfully",
            });
        }
    );
});

/* =========================
   GET ALL REQUESTS
========================= */

app.get("/requests", (req, res) => {
    const sql =
        "SELECT * FROM trip_requests ORDER BY id DESC";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to Fetch Requests",
            });
        }

        res.json(result);
    });
});

/* =========================
   UPDATE REQUEST STATUS
========================= */

app.put("/request/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql =
        "UPDATE trip_requests SET status = ? WHERE id = ?";

    db.query(
        sql,
        [status, id],
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to Update Request",
                });
            }

            res.json({
                message: "Request Updated Successfully",
            });
        }
    );
});

/* =========================
   SEND MESSAGE
========================= */

app.post("/message", (req, res) => {
    const {
        senderName,
        receiverName,
        message,
        roomId,
    } = req.body;

    const sql = `
    INSERT INTO messages
    (
      sender_name,
      receiver_name,
      message,
      room_id
    )
    VALUES (?, ?, ?, ?)
  `;

    db.query(
        sql,
        [
            senderName,
            receiverName,
            message,
            roomId,
        ],
        (err) => {
            if (err) {
                console.error("Message Send Error:", err);
                return res.status(500).json({
                    message: "Message Send Failed",
                });
            }

            res.json({
                message: "Message Sent Successfully",
            });
        }
    );
});

/* =========================
   GET MESSAGES
========================= */

app.get("/messages/:roomId", (req, res) => {
    const { roomId } = req.params;

    const sql = `
    SELECT *
    FROM messages
    WHERE room_id = ?
    ORDER BY id ASC
  `;

    db.query(
        sql,
        [roomId],
        (err, result) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to Fetch Messages",
                });
            }

            res.json(result);
        }
    );
});

/* =========================
   SOCKET.IO
========================= */
io.on("connection", (socket) => {
    console.log("User Connected");

    // Join chat room
    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`Joined Room: ${room}`);
    });

    // Real-time chat
    socket.on("send_message", (data) => {
        socket.to(data.room).emit(
            "receive_message",
            data
        );
    });

    // Call request
    socket.on(
        "call_user",
        (data) => {
            socket.to(data.room).emit(
                "incoming_call",
                {
                    caller: data.caller,
                }
            );
        }
    );

    // Call accepted
    socket.on(
        "accept_call",
        (data) => {
            socket.to(data.room).emit(
                "call_accepted",
                {
                    accepter: data.accepter,
                }
            );
        }
    );

    // WebRTC Offer
    socket.on(
        "offer",
        (data) => {
            socket.to(data.room).emit(
                "offer",
                {
                    offer: data.offer,
                }
            );
        }
    );


    socket.on(
        "answer",
        (data) => {
            socket.to(data.room).emit(
                "answer",
                {
                    answer: data.answer,
                }
            );
        }
    );

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });

    socket.on(
        "ice_candidate",
        (data) => {
            socket.to(data.room).emit(
                "ice_candidate",
                {
                    candidate: data.candidate,
                }
            );
        }
    );
});

/* =========================
   NOTIFICATIONS
========================= */

app.get("/notifications", (req, res) => {
    const { userId } = req.query;

    const sql =
        `
  SELECT *
  FROM notifications
  WHERE user_id = ?
  ORDER BY id DESC
`;

    db.query(
        sql,
        [userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed",
                });
            }

            res.json(result);
        });
});

app.put("/notifications/:id/read", (req, res) => {
    const { id } = req.params;

    const sql =
        "UPDATE notifications SET is_read = 1 WHERE id = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({
                message: "Failed",
            });
        }

        res.json({
            message: "Notification Read",
        });
    });
});

/* =========================
   UPDATE PROFILE
========================= */

app.put("/update-profile", (req, res) => {
    const { id, name, email, bio } = req.body;

    const sql =
        "UPDATE users SET name = ?, email = ?, bio = ? WHERE id = ?";

    db.query(
        sql,
        [name, email, bio, id],
        (err, result) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Profile Update Failed",
                });
            }

            res.json({
                message: "Profile Updated Successfully",
            });
        }
    );
});

/* =========================
   AI TRIP PLANNER
========================= */

app.post(
    "/generate-trip-plan",
    async (req, res) => {
        try {
            const {
                destination,
                budget,
                days,
                interests,
            } = req.body;

            console.log("AI Route Hit");
            console.log(req.body);

            const prompt = `
Create a detailed travel itinerary.

Destination: ${destination}
Budget: ${budget}
Days: ${days}
Interests: ${interests}

Provide:
1. Day-wise itinerary
2. Places to visit
3. Food recommendations
4. Budget tips
`;

            const result =
                await model.generateContent(
                    prompt
                );

            console.log("RESULT:");
            console.log(result);

            const plan =
                result.response.text();

            console.log("PLAN:");
            console.log(plan);

            res.json({
                plan,
            });

        } catch (error) {

            console.error("GEMINI ERROR:");
            console.error(error);

            if (error.status === 429) {
                return res.json({
                    plan: `
⚠️ AI quota exceeded.

Please try again later.

Sample Travel Plan:

Day 1
• Explore local attractions
• Try local food
• Evening sightseeing

Day 2
• Adventure activities
• Shopping
• Return journey
      `,
                });
            }

            res.status(500).json({
                message: "Failed to Generate Plan",
            });
        }
    }
);

/* =========================
   SERVER CONFIG
========================= */

const PORT =
    process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});