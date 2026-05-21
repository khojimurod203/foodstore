JMeter test plan for Food Store

Prerequisites
- Java 8+ installed
- Apache JMeter installed and on your PATH (`jmeter` command)

Quick start

This JMeter plan is configured to run against the live site `khfoodstorevistula.netlify.app` using HTTPS.

Run the plan against the live site directly with:

```bash
jmeter -n -t jmeter/foodstore_test.jmx -l jmeter/results.jtl -e -o jmeter/report
```

If you want to target a different live host, update `jmeter/foodstore_test.jmx` with the desired domain, port, and protocol.

Notes
- This plan loads `index.html`, `style.css` and `scripts.js` and verifies HTTP 200 responses.
- The plan is protocol-level (HTTP) testing — it does not execute client-side JavaScript interactions like adding items to the cart. Use the provided Selenium WebDriver tests for functional UI verification.
