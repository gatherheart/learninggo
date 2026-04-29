export interface InterviewQuestion {
  id: string;
  level: "junior" | "mid" | "senior";
  topic: string;
  title: string;
  prompt: string[];
  options: string[];
  answer: number;
  explanation: string;
}

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: "zero_value_useful",
    level: "junior",
    topic: "basics",
    title: "Useful zero values",
    prompt: [
      "A Go engineer says many standard-library-friendly types are easier to use because the zero value is meaningful.",
      "Why is that a strong design property?",
    ],
    options: [
      "It lets a type often be declared and used immediately without a mandatory constructor ceremony.",
      "It makes the type immutable forever.",
      "It removes the need for testing.",
    ],
    answer: 0,
    explanation:
      "Go APIs often aim for \"the zero value is useful\" because it reduces setup friction and simplifies common cases without giving up explicitness.",
  },
  {
    id: "slice_append_aliasing",
    level: "junior",
    topic: "slices",
    title: "Slice append aliasing",
    prompt: [
      "You pass a slice to a helper, append to it there, and later see surprising mutation behavior in the caller.",
      "What is the most important underlying reason to understand first?",
    ],
    options: [
      "Slices are descriptors over backing arrays, so aliasing depends on capacity and whether append reuses storage.",
      "Append always deep-copies every element before returning.",
      "Slices are immutable unless wrapped in a pointer.",
    ],
    answer: 0,
    explanation:
      "A slice is pointer/len/cap metadata over storage. If append reuses capacity, multiple slices may still observe the same backing array.",
  },
  {
    id: "map_lookup_ambiguity",
    level: "junior",
    topic: "maps",
    title: "Map lookup ambiguity",
    prompt: [
      "A candidate writes `value := m[key]` and assumes `0` means the key was missing.",
      "Why is that reasoning incomplete?",
    ],
    options: [
      "Because map access is unordered, not because of the value itself.",
      "Because the zero value might also be a legitimate stored value, so presence must often be checked separately.",
      "Because map lookups always panic on missing keys.",
    ],
    answer: 1,
    explanation:
      "The issue is not ordering; it is ambiguity. A zero value can mean either absence or a real stored value, which is why `value, ok := m[key]` matters.",
  },
  {
    id: "interface_nil",
    level: "junior",
    topic: "interfaces",
    title: "Typed nil inside interface",
    prompt: [
      "A function returns a typed nil pointer as an `error`, and `err != nil` unexpectedly evaluates to true.",
      "Why?",
    ],
    options: [
      "Because interface values carry both dynamic type and value, so a non-nil dynamic type makes the interface non-nil.",
      "Because Go randomizes nil checks on interface values.",
      "Because all errors are strings internally.",
    ],
    answer: 0,
    explanation:
      "An interface can hold a nil concrete value together with a non-nil concrete type. That interface value itself is then non-nil.",
  },
  {
    id: "pointer_receiver_reason",
    level: "junior",
    topic: "structs",
    title: "Pointer receiver reasoning",
    prompt: [
      "A method increments a counter field, but a reviewer says it should use a pointer receiver.",
      "What is the strongest reason?",
    ],
    options: [
      "Because pointer receivers are required for all methods in Go.",
      "Because mutation should affect the caller-owned value rather than a copy of the struct.",
      "Because only pointer receivers can satisfy interfaces.",
    ],
    answer: 1,
    explanation:
      "Value receivers operate on a copy. If the goal is to mutate the original struct, a pointer receiver expresses that ownership and behavior correctly.",
  },
  {
    id: "errors_are_values",
    level: "junior",
    topic: "errors",
    title: "Errors are values",
    prompt: [
      "What does the Go phrase `errors are values` actually try to teach?",
    ],
    options: [
      "That errors are part of normal control flow and should be checked, wrapped, and returned explicitly like other values.",
      "That errors should always be ignored after logging once.",
      "That Go has no control flow for failures at all.",
    ],
    answer: 0,
    explanation:
      "The phrase emphasizes explicit, visible error handling rather than hidden exception-like control transfer for ordinary failures.",
  },
  {
    id: "defer_cleanup",
    level: "junior",
    topic: "defer",
    title: "Defer as cleanup structure",
    prompt: [
      "Why is `defer` so common around `Close`, `Unlock`, and similar operations?",
    ],
    options: [
      "Because `defer` makes the function asynchronous.",
      "Because `defer` keeps cleanup near acquisition while still running it when the function returns.",
      "Because `defer` eliminates the need for return values.",
    ],
    answer: 1,
    explanation:
      "The main value is structural clarity and correctness. Cleanup is declared close to resource acquisition while still executing at function exit.",
  },
  {
    id: "goroutine_leak_context",
    level: "junior",
    topic: "context",
    title: "Goroutine leak prevention",
    prompt: [
      "You start background goroutines per request, and some survive long after the request is gone.",
      "What is the cleanest first-principle fix?",
    ],
    options: [
      "Tie the goroutine work to a context or explicit cancellation path that the downstream code actually observes.",
      "Replace all goroutines with global variables.",
      "Call `panic` when the request ends.",
    ],
    answer: 0,
    explanation:
      "Leak prevention starts with lifecycle ownership. If background work should stop with the request, it needs a cancellation signal and code that respects it.",
  },
  {
    id: "select_default_tradeoff",
    level: "junior",
    topic: "channels",
    title: "Select with default",
    prompt: [
      "A `select` statement has a `default` case and seems to avoid blocking, but CPU usage spikes.",
      "What is the first thing to suspect?",
    ],
    options: [
      "The loop may now be spinning instead of waiting, trading blocking for busy work.",
      "The channel turned into a mutex automatically.",
      "The scheduler disables goroutines when `default` exists.",
    ],
    answer: 0,
    explanation:
      "A `default` case can make a `select` non-blocking. In a loop, that can become a busy-spin if no other pacing mechanism exists.",
  },
  {
    id: "escape_analysis_perf",
    level: "mid",
    topic: "runtime",
    title: "Escape analysis and performance",
    prompt: [
      "A hot path allocates more than expected after a refactor, even though the logic is still simple.",
      "Which explanation is strongest?",
    ],
    options: [
      "A value that used to stay on the stack may now escape, forcing heap allocation and increasing GC pressure.",
      "Go moved the whole package into reflection mode.",
      "Imports automatically allocate one heap object per file.",
    ],
    answer: 0,
    explanation:
      "Escape analysis determines whether lifetime requirements force heap allocation. Small signature or ownership changes can affect allocation behavior materially.",
  },
  {
    id: "gc_latency_tradeoff",
    level: "mid",
    topic: "gc",
    title: "GC and tail latency",
    prompt: [
      "The service is correct, throughput is decent, but p99 latency spikes during heavy allocation periods.",
      "What is the best first systems explanation?",
    ],
    options: [
      "Allocation rate and object lifetime shape GC work, which can affect latency even when application logic is correct.",
      "The scheduler stops understanding functions under load.",
      "Go disables maps during garbage collection.",
    ],
    answer: 0,
    explanation:
      "GC is part of runtime behavior, not only memory safety. Heap churn, pointer-rich structures, and short-lived allocation bursts can influence latency distribution.",
  },
  {
    id: "channel_vs_mutex",
    level: "mid",
    topic: "concurrency",
    title: "Channel versus mutex choice",
    prompt: [
      "You need to protect shared state in one service and coordinate ownership handoff in another.",
      "What is the strongest decision rule?",
    ],
    options: [
      "Use channels for communication and ownership transfer patterns; use mutexes when multiple goroutines truly share mutable state.",
      "Always prefer channels because mutexes are obsolete.",
      "Always prefer mutexes because channels are only for toy examples.",
    ],
    answer: 0,
    explanation:
      "These tools solve different problems well. The right choice depends on whether the design is best expressed as shared state protection or explicit work/data handoff.",
  },
  {
    id: "memory_model_visibility",
    level: "mid",
    topic: "memory model",
    title: "Visibility without synchronization",
    prompt: [
      "One goroutine writes a flag, another spins reading it, and the code assumes the second goroutine will eventually observe the write.",
      "What is the interview-critical issue?",
    ],
    options: [
      "Without a happens-before relationship, visibility and ordering assumptions are not justified by the memory model.",
      "The code fails only because booleans cannot be shared.",
      "Spinning automatically creates a synchronization boundary.",
    ],
    answer: 0,
    explanation:
      "Concurrent correctness is not just about syntax. You need a documented synchronization event that creates the visibility guarantee you are assuming.",
  },
  {
    id: "http_handler_architecture",
    level: "mid",
    topic: "net/http",
    title: "Handler architecture",
    prompt: [
      "An HTTP handler now parses transport data, validates input, executes SQL, applies business rules, and formats the response all in one function.",
      "What is the architectural risk?",
    ],
    options: [
      "Transport, domain, and persistence concerns are tightly coupled, making the code harder to test, evolve, and reason about.",
      "Handlers are not allowed to call services in Go.",
      "Only interfaces can appear inside handlers.",
    ],
    answer: 0,
    explanation:
      "The problem is not that the code runs, but that boundaries disappear. Real service code benefits from cleaner separation between request parsing, business logic, and data access.",
  },
  {
    id: "context_value_misuse",
    level: "mid",
    topic: "context",
    title: "Misusing context values",
    prompt: [
      "A codebase starts putting ordinary domain parameters into `context.Context` to avoid changing function signatures.",
      "Why is that a design smell?",
    ],
    options: [
      "Because context is mainly for cancellation, deadlines, and scoped cross-cutting metadata, not for hiding normal required inputs.",
      "Because context values are slower than integers by language law.",
      "Because `context.Context` cannot cross package boundaries.",
    ],
    answer: 0,
    explanation:
      "The issue is API clarity and ownership. Business-critical inputs should stay explicit in function signatures rather than being smuggled through context.",
  },
  {
    id: "bounded_worker_queue",
    level: "mid",
    topic: "architecture",
    title: "Bounded queues and overload",
    prompt: [
      "A worker pool accepts jobs indefinitely into an unbounded buffered channel.",
      "What systems risk should you call out first?",
    ],
    options: [
      "If producers outrun consumers for long enough, memory growth becomes a backpressure failure.",
      "Buffered channels cannot hold structs.",
      "Go automatically caps channel memory usage regardless of program design.",
    ],
    answer: 0,
    explanation:
      "Unbounded intake plus bounded work completion means load is converted into queued memory. That is often the real overload mechanism.",
  },
  {
    id: "error_wrapping_observability",
    level: "mid",
    topic: "errors",
    title: "Error wrapping and observability",
    prompt: [
      "An engineer keeps returning plain `errors.New(\"failed\")` from multiple layers.",
      "Why is that weak in real systems?",
    ],
    options: [
      "Because all errors must be panics instead.",
      "Because context is lost, making debugging and classification harder as failures cross boundaries.",
      "Because Go forbids creating new errors in functions.",
    ],
    answer: 1,
    explanation:
      "Operationally useful errors preserve context. Strong answers mention wrapping, classification, and how failures are understood in logs and metrics.",
  },
  {
    id: "testing_table_driven",
    level: "mid",
    topic: "testing",
    title: "Why table-driven tests matter",
    prompt: [
      "Why are table-driven tests especially valuable in Go codebases?",
    ],
    options: [
      "They make it easier to scale one test shape across many input/output cases without duplicating structure.",
      "They eliminate the need for assertions.",
      "They automatically prove concurrency correctness.",
    ],
    answer: 0,
    explanation:
      "The strength is maintainable breadth. New edge cases can often be added by extending data rather than rewriting the test structure.",
  },
  {
    id: "benchmark_vs_micro_optimization",
    level: "mid",
    topic: "tooling",
    title: "Benchmark before micro-optimizing",
    prompt: [
      "A teammate wants to apply low-level micro-optimizations without first measuring performance.",
      "What is the strongest response?",
    ],
    options: [
      "Optimization should be guided by evidence such as benchmarks and profiles, not by intuition alone.",
      "Micro-optimizations are always wrong.",
      "Go programs cannot be benchmarked meaningfully.",
    ],
    answer: 0,
    explanation:
      "The disciplined answer is not \"never optimize\" but \"optimize based on measured bottlenecks rather than guesses.\"",
  },
  {
    id: "scheduler_gmp",
    level: "mid",
    topic: "runtime",
    title: "Why the Go scheduler exists",
    prompt: [
      "Why does Go use its own goroutine scheduler rather than mapping every goroutine 1:1 onto an OS thread?",
    ],
    options: [
      "Because goroutines are intended to be much lighter-weight and more numerous than OS threads.",
      "Because OS threads cannot run Go code.",
      "Because Go forbids parallel execution.",
    ],
    answer: 0,
    explanation:
      "The runtime scheduler exists so concurrency structure can stay cheap and abundant without forcing one heavyweight OS thread per logical task.",
  },
  {
    id: "profiling_before_optimizing",
    level: "senior",
    topic: "tooling",
    title: "Profiling before optimization",
    prompt: [
      "A team wants to rewrite a subsystem because it feels slow, but no profiling data exists.",
      "What is the strongest engineering response?",
    ],
    options: [
      "Rewrite first, profile later.",
      "Establish evidence with profiling, allocation data, and latency breakdowns before selecting an optimization strategy.",
      "Ban benchmarks because they bias engineers.",
    ],
    answer: 1,
    explanation:
      "Performance work without measurement is often expensive guesswork. Strong interview answers emphasize evidence, not intuition alone.",
  },
  {
    id: "worker_pool_backpressure",
    level: "senior",
    topic: "architecture",
    title: "Backpressure in worker systems",
    prompt: [
      "A worker pool accepts jobs faster than downstream processing can finish them, and memory usage keeps rising.",
      "What should a senior engineer focus on first?",
    ],
    options: [
      "Throughput is fine as long as goroutines are cheap.",
      "The system needs an explicit backpressure strategy such as bounded queues, rejection, load shedding, or upstream throttling.",
      "Increase logs until memory usage drops.",
    ],
    answer: 1,
    explanation:
      "Cheap goroutines do not eliminate capacity limits. If intake is unbounded while work completion is bounded, the queue becomes your memory leak in slow motion.",
  },
  {
    id: "distributed_idempotency",
    level: "senior",
    topic: "distributed systems",
    title: "Retries and idempotency",
    prompt: [
      "A network client retries on timeout, but the server action is not idempotent.",
      "What is the core architectural risk?",
    ],
    options: [
      "Retries can duplicate side effects unless the protocol or operation design provides idempotency or deduplication.",
      "Timeouts guarantee the original request never ran.",
      "TCP prevents duplicate business actions automatically.",
    ],
    answer: 0,
    explanation:
      "Timeout does not mean \"did not execute.\" Real distributed design must account for partial execution, duplicate delivery attempts, and side-effect safety.",
  },
  {
    id: "service_decomposition",
    level: "senior",
    topic: "architecture",
    title: "Service decomposition tradeoff",
    prompt: [
      "A team proposes splitting one Go service into many smaller services immediately.",
      "What is the strongest cautionary response?",
    ],
    options: [
      "More services always means better architecture.",
      "Decomposition should be justified by ownership, scaling, deployment, and failure-boundary needs, not by service count aesthetics.",
      "Microservices remove the need for observability.",
    ],
    answer: 1,
    explanation:
      "Distributed boundaries add operational cost. Strong architecture decisions justify why a new boundary improves ownership or system behavior enough to repay that cost.",
  },
  {
    id: "grpc_http_boundary",
    level: "senior",
    topic: "architecture",
    title: "Boundary choice between protocols",
    prompt: [
      "A service boundary could be modeled as HTTP/JSON or as a more strongly typed internal RPC layer.",
      "What is the strongest interview-quality framing?",
    ],
    options: [
      "Protocol choice should be justified by clients, contracts, tooling, latency, operability, and organizational boundaries rather than trend preference.",
      "Internal RPC is always correct for every boundary.",
      "HTTP is only for browsers and never for services.",
    ],
    answer: 0,
    explanation:
      "Good architecture answers compare tradeoffs and boundary needs rather than choosing technology by fashion.",
  },
  {
    id: "observability_signal",
    level: "senior",
    topic: "operations",
    title: "Observability is a design concern",
    prompt: [
      "An incident keeps recurring, but each time the team says there was not enough telemetry to explain it.",
      "What is the strongest architectural lesson?",
    ],
    options: [
      "Observability is not just post-processing; systems should be designed so logs, metrics, traces, and identifiers support debugging from the start.",
      "Telemetry should only be added after the final rewrite.",
      "Incidents are usually unrelated to instrumentation gaps.",
    ],
    answer: 0,
    explanation:
      "Production debugging quality depends on what signals the system emits. Strong engineering designs observability into the service rather than treating it as a last-minute add-on.",
  },
  {
    id: "graceful_shutdown",
    level: "senior",
    topic: "operations",
    title: "Graceful shutdown under load",
    prompt: [
      "A service receives a termination signal during peak traffic.",
      "What is the strongest senior-level concern?",
    ],
    options: [
      "Only the process exit code matters.",
      "The service should stop accepting new work, allow in-flight work to finish or time out cleanly, and coordinate shutdown across dependencies.",
      "Shutdown should panic so the orchestrator restarts faster.",
    ],
    answer: 1,
    explanation:
      "Graceful shutdown is about lifecycle discipline: intake, in-flight work, deadlines, resource cleanup, and client-visible behavior all matter.",
  },
  {
    id: "ownership_of_interfaces",
    level: "senior",
    topic: "architecture",
    title: "Who should own an interface",
    prompt: [
      "A shared package defines very large interfaces for many services to implement.",
      "What is the strongest critique?",
    ],
    options: [
      "Large provider-owned interfaces often increase coupling; consumers should usually own smaller behavior-focused abstractions.",
      "Interfaces should always live in the root module only.",
      "Go interfaces should match database schemas exactly.",
    ],
    answer: 0,
    explanation:
      "A common senior-level lesson in Go is that consumer-owned, minimal interfaces usually preserve flexibility better than giant shared contracts shaped by one implementation surface.",
  },
  {
    id: "end_to_end_interview_view",
    level: "senior",
    topic: "interview strategy",
    title: "What a strong Go interview answer sounds like",
    prompt: [
      "For mid-to-senior interviews, what usually distinguishes a strong answer from a merely correct one?",
    ],
    options: [
      "Only mentioning syntax and memorized vocabulary.",
      "Connecting language/runtime facts to correctness, performance, operability, and architecture tradeoffs.",
      "Avoiding any mention of production behavior.",
    ],
    answer: 1,
    explanation:
      "Strong answers connect the local code question to the broader system consequences: latency, memory, ownership, cancellation, debugging, or failure behavior.",
  },
];
