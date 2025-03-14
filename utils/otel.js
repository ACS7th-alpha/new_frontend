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
                      // Tracer 설정
                      const provider = new WebTracerProvider();
                      const exporter = new OTLPTraceExporter({
                        url:
                          process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT ||
                          "http://adot-collector.default.svc.cluster.local:4318/v1/traces",
                      });

                      provider.addSpanProcessor(
                        new SimpleSpanProcessor(exporter)
                      );
                      provider.register();

                      // API 요청 추적 활성화 (Fetch, XHR)
                      registerInstrumentations({
                        instrumentations: [
                          new FetchInstrumentation(),
                          new XMLHttpRequestInstrumentation(),
                        ],
                      });

                      console.log(
                        "✅ OpenTelemetry tracing initialized in Next.js (Client Side)"
                      );
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
