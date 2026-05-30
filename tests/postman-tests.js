pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Performance Tier: Response is within acceptable limits (<3000ms)", function () {
    pm.expect(pm.response.responseTime).to.be.below(3000);
});

var responseTime = pm.response.responseTime;

if (responseTime <= 1500) {
    console.log("Tier [PERFECT]: Lightning fast response at " + responseTime + "ms");
} else if (responseTime > 1500 && responseTime < 3000) {
    console.warn("Tier [ACCEPTABLE]: Data fetched successfully, but routing is non-ideal at " + responseTime + "ms");
} else {
    console.error("Tier [CRITICAL] API Latency has breached 3 seconds! " + responseTime + "ms");
}