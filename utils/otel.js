import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";

// Tracer 설정
const provider = new WebTracerProvider();
const exporter = new OTLPTraceExporter({
  url: process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT || "http://adot-collector.default.svc.cluster.local:4318/v1/traces",
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

// API 요청 추적 활성화 (Fetch, XHR)
registerInstrumentations({
  instrumentations: [new FetchInstrumentation(), new XMLHttpRequestInstrumentation()],
});

console.log("✅ OpenTelemetry tracing initialized in Next.js");
