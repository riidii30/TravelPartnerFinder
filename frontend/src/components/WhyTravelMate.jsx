function WhyTravelMate() {
    const features = [
        {
            title: "Verified Travelers",
            icon: "🔒",
            desc: "Connect with genuine travel enthusiasts."
        },
        {
            title: "Smart Matching",
            icon: "🤝",
            desc: "Find people with similar travel interests."
        },
        {
            title: "Trip Planning",
            icon: "🗺️",
            desc: "Plan trips together with ease."
        },
        {
            title: "Real-Time Chat",
            icon: "💬",
            desc: "Stay connected before and during trips."
        }
    ];

    return (
        <section
            className="container py-5"
            style={{
                background: "#ffffff",
                borderRadius: "24px"
            }}
        >
            <h2 className="text-center mb-5">
                Why TravelMate?
            </h2>

            <div className="row">
                {features.map((feature) => (
                    <div className="col-md-3 mb-4" key={feature.title}>
                        <div className="card h-100 text-center p-4">
                            <h1>{feature.icon}</h1>

                            <h5>{feature.title}</h5>

                            <p>{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default WhyTravelMate;