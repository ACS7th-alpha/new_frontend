console.log("✅ OTEL.js loaded"); // 🔥 OTEL.js가 실행되는지 확인!

if (typeof window !== "undefined") {
  import("@opentelemetry/sdk-trace-web").then(({ WebTracerProvider }) => {
    import("@opentelemetry/exporter-trace-otlp-http").then(
      ({ OTLPTraceExporter }) => {
        import("@opentelemetry/sdk-trace-base").then(
          ({ SimpleSpanProcessor }) => {
            import("@opentelemetry/instrumentation").then(
              ({ registerInstrumentations }) => {
                import("@opentelemetry/instrumentation-fetch").then(
                  ({ FetchInstrumentation }) => {
                    import(
                      "@opentelemetry/instrumentation-xml-http-request"
                    ).then(({ XMLHttpRequestInstrumentation }) => {
                      try {
                        // ✅ 트레이서 제공자 설정
                        const provider = new WebTracerProvider();
                        const exporter = new OTLPTraceExporter({
                          url:
                            process.env
                              .NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT ||
                            "http://adot-collector.default.svc.cluster.local:4318/v1/traces",
                        });

                        provider.addSpanProcessor(
                          new SimpleSpanProcessor(exporter)
                        );
                        provider.register();

                        // ✅ API 요청 추적 활성화 (Fetch, XHR)
                        registerInstrumentations({
                          instrumentations: [
                            new FetchInstrumentation(),
                            new XMLHttpRequestInstrumentation(),
                          ],
                        });

                        console.log(
                          "✅ OpenTelemetry tracing initialized in Next.js (Client Side)"
                        );

                        // ✅ 강제 트레이스 실행 (기본 샘플)
                        const { trace } = require("@opentelemetry/api");
                        const tracer = trace.getTracer("forced-tracer");

                        const span = tracer.startSpan("forced-span");
                        setTimeout(() => {
                          span.end();
                          console.log("✅ 강제 트레이스(span) 실행 완료!");
                        }, 1000);
                      } catch (error) {
                        console.error("❌ OpenTelemetry 초기화 실패:", error);
                      }
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
}
