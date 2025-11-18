# Research Summary: Distributed Playwright Testing via Tailscale LAN

## Context

Research on distributed Playwright E2E testing across 4 additional computers connected via Tailscale LAN to speed up test execution for a Next.js 15 blog platform.

## Options Evaluated

1. Playwright Native Sharding (Official)
2. Custom Browser Server Architecture (WebSocket)
3. Docker/Kubernetes Orchestration
4. Third-party Platforms (Currents.dev, LambdaTest)
5. DIY Browser Pool Implementation

## Detailed Analysis

### Option A: Playwright Native Sharding (Recommended)

**Pros:**

- Native Playwright feature, officially supported
- Execution time reduced from 60 minutes to ~15 minutes with 4 machines (4x speedup)
- Simple implementation: just use `--shard=x/y` flag
- Works with existing CI/CD platforms
- Can combine with local workers for multi-level parallelism
- No additional dependencies or infrastructure

**Cons:**

- Requires orchestration layer to coordinate shards
- Test distribution is automatic (less control over which tests run where)
- All machines need identical environments

**Key Metrics:**

- Performance gain: 75% reduction in execution time with 4 shards
- Setup complexity: Low
- Maintenance: Minimal
- Network overhead: Negligible (only results collection)

**Implementation Example:**

```bash
# Machine 1
npx playwright test --shard=1/4

# Machine 2
npx playwright test --shard=2/4

# Machine 3
npx playwright test --shard=3/4

# Machine 4
npx playwright test --shard=4/4
```

**Sources:**

- [Playwright Sharding Documentation](https://playwright.dev/docs/test-sharding)
- [Playwright Parallelism Guide](https://playwright.dev/docs/test-parallel)

---

### Option B: Custom Browser Server Architecture

**Pros:**

- Full control over browser instances
- Reusable browser sessions across tests
- Can run browser servers on powerful machines, tests on lightweight ones
- Works over Tailscale network using WebSocket connections

**Cons:**

- More complex setup and maintenance
- Version compatibility requirements (client/server must match)
- Need to manage browser server lifecycle
- Security considerations for exposed WebSocket endpoints

**Key Metrics:**

- Setup complexity: High
- Flexibility: Maximum
- Network overhead: Moderate (WebSocket communication)
- Resource efficiency: Good (shared browser instances)

**Implementation Example:**

```javascript
// On browser server machines (via Tailscale IP)
const browserServer = await chromium.launchServer({
  port: 3000,
  wsPath: '/browser',
})
const wsEndpoint = browserServer.wsEndpoint()
// Returns: ws://[tailscale-ip]:3000/browser

// On test runner machine
const browser = await chromium.connect(wsEndpoint)
// Run tests using connected browser
```

**Sources:**

- [Playwright BrowserType API](https://playwright.dev/docs/api/class-browsertype)

---

### Option C: Docker/Kubernetes Orchestration

**Pros:**

- Isolated, reproducible test environments
- Easy scaling up/down
- Works well with existing container infrastructure
- Good for mixed OS/browser testing

**Cons:**

- Requires Docker/Kubernetes knowledge
- Container overhead
- Complex networking setup with Tailscale
- Overkill for 4-machine setup

**Key Metrics:**

- Setup complexity: Very High
- Scalability: Excellent
- Maintenance: High
- Resource overhead: Significant

**Sources:**

- [Playwright Docker Guide](https://playwright.dev/docs/ci)

---

### Option D: Third-party Platforms

**Pros:**

- Currents.dev: Built for Playwright, provides orchestration and reporting
- LambdaTest/BrowserStack: Managed infrastructure, 3000+ browser combinations
- Parallel execution and load balancing included

**Cons:**

- Monthly costs ($100-1000+/month)
- External dependency
- Data leaves your network
- Not utilizing existing hardware

**Key Metrics:**

- Setup complexity: Low
- Cost: High (recurring)
- Features: Most comprehensive
- Not suitable since hardware already available

---

### Option E: DIY Browser Pool Implementation

**Pros:**

- Custom control over resource allocation
- Can implement smart test distribution
- Reusable for other automation tasks

**Cons:**

- Significant development effort
- Need to handle failures, retries, load balancing
- Essentially recreating existing solutions

**Key Metrics:**

- Development time: 40-80 hours
- Maintenance: Ongoing
- Not recommended given native alternatives

---

## Comparison Matrix

| Criteria             | Native Sharding | Browser Server | Docker/K8s | Third-party | DIY Pool |
| -------------------- | --------------- | -------------- | ---------- | ----------- | -------- |
| Performance          | ⭐⭐⭐⭐⭐      | ⭐⭐⭐⭐       | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐  | ⭐⭐⭐   |
| Setup Ease           | ⭐⭐⭐⭐⭐      | ⭐⭐           | ⭐         | ⭐⭐⭐⭐    | ⭐       |
| Maintenance          | ⭐⭐⭐⭐⭐      | ⭐⭐⭐         | ⭐⭐       | ⭐⭐⭐⭐⭐  | ⭐⭐     |
| Cost                 | ⭐⭐⭐⭐⭐      | ⭐⭐⭐⭐⭐     | ⭐⭐⭐⭐   | ⭐          | ⭐⭐⭐⭐ |
| Tailscale Compatible | ✅              | ✅             | ⚠️         | N/A         | ✅       |

---

## Recommendation

**Choice: Playwright Native Sharding with Orchestration Script**

**Reasoning:**
For your specific setup with 4 Tailscale-connected machines and a Next.js 15 blog, native sharding provides the best balance of simplicity, performance, and maintainability. With 4 machines, you can expect approximately 75% reduction in test execution time (from 60 to 15 minutes for typical suites). The implementation requires minimal code changes and works seamlessly over Tailscale's secure network without exposing services.

The native sharding approach is battle-tested, officially supported, and requires no additional infrastructure beyond what you already have. It integrates perfectly with your existing Playwright setup and can be enhanced with local workers on each machine for even better parallelization.

**Implementation Considerations:**

- Ensure all machines have identical Node.js and Playwright versions
- Use Tailscale SSH for remote command execution
- Store test results centrally (shared folder or S3)
- Consider using GitHub Actions or similar for orchestration

**Validation Approach:**

1. Start with 2 machines to validate the setup
2. Measure baseline performance on single machine
3. Compare with 2-shard execution
4. Scale to all 4 machines once validated
5. Fine-tune with `--workers` flag per machine based on specs

**Fallback Option:**
If sharding doesn't provide sufficient control, implement Browser Server architecture for specific long-running tests while keeping sharding for the main suite.

---

## Implementation Approaches (Ranked by Feasibility)

### 1. Quick Win: Basic Sharding (1-2 hours)

```bash
# orchestrate.sh - Run from main machine
#!/bin/bash
TOTAL_SHARDS=4

# Run shards in parallel via SSH
for i in {1..4}; do
  if [ $i -eq 1 ]; then
    # Run locally
    npx playwright test --shard=$i/$TOTAL_SHARDS &
  else
    # Run on remote machines via Tailscale SSH
    ssh machine$i "cd /path/to/project && npx playwright test --shard=$i/$TOTAL_SHARDS" &
  fi
done

# Wait for all shards to complete
wait

# Merge results
npx playwright merge-reports --reporter html ./playwright-report-*
```

### 2. Intermediate: Node.js Orchestrator (4-8 hours)

```javascript
// distribute-tests.js
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const machines = [
  'localhost',
  'machine2.tailscale',
  'machine3.tailscale',
  'machine4.tailscale',
]

async function runDistributedTests() {
  const totalShards = machines.length

  const promises = machines.map((machine, index) => {
    const shard = index + 1
    const command =
      machine === 'localhost'
        ? `npx playwright test --shard=${shard}/${totalShards}`
        : `ssh ${machine} "cd /project && npx playwright test --shard=${shard}/${totalShards}"`

    return execAsync(command)
  })

  const results = await Promise.allSettled(promises)

  // Process results, merge reports
  console.log('Test execution complete:', results)
}

runDistributedTests()
```

### 3. Advanced: Full Orchestration Platform (16-40 hours)

- Build web dashboard for monitoring
- Implement intelligent test distribution based on test duration
- Add retry logic for failed shards
- Create result aggregation and reporting
- Add resource monitoring per machine

---

## Specific Recommendations for Your Setup

### Given Your Stack:

- **Next.js 15 blog**: Mostly UI/integration tests, perfect for sharding
- **Playwright + Jest**: Keep Jest tests local, distribute Playwright tests
- **Tailscale LAN**: Secure, no VPN overhead, direct machine access
- **4 spare machines**: Ideal for 4-way sharding

### Immediate Action Plan:

#### Step 1: Prepare Machines (30 minutes)

```bash
# On each machine via Tailscale SSH
git clone [your-repo]
cd news.plantdoctor.app
pnpm install
npx playwright install chromium
```

#### Step 2: Test Connectivity (15 minutes)

```bash
# From main machine
for machine in machine2 machine3 machine4; do
  ssh $machine.tailscale "cd /path/to/news.plantdoctor.app && npx playwright --version"
done
```

#### Step 3: Run Distributed Tests (5 minutes)

```bash
# Create run-distributed.sh
#!/bin/bash
pnpm test:e2e --shard=1/4 &
ssh machine2.tailscale "cd /path/to/news.plantdoctor.app && pnpm test:e2e --shard=2/4" &
ssh machine3.tailscale "cd /path/to/news.plantdoctor.app && pnpm test:e2e --shard=3/4" &
ssh machine4.tailscale "cd /path/to/news.plantdoctor.app && pnpm test:e2e --shard=4/4" &
wait
```

#### Step 4: Collect Results

```bash
# Merge HTML reports
npx playwright merge-reports --reporter html ./test-results-*
```

### Performance Expectations:

- **Current (1 machine)**: ~X minutes for full E2E suite
- **Expected (4 machines)**: ~X/4 minutes + 1-2 minutes overhead
- **With workers (4 machines × 4 workers)**: Even faster for CPU-bound tests

### Advanced Optimizations:

1. **Smart Distribution**: Analyze test durations, distribute by time not count
2. **Failover**: If machine fails, redistribute its shard to others
3. **Caching**: Share `node_modules` via Tailscale network drive
4. **Parallel Levels**: Use `--workers=4` on each machine for 16x parallelism

---

## Network Considerations with Tailscale

### Advantages:

- Zero-configuration networking between machines
- End-to-end encryption via WireGuard
- No port forwarding or firewall rules needed
- Stable IPs via MagicDNS (machine1.tailscale, etc.)

### Setup Tips:

1. Use Tailscale SSH for passwordless access
2. Consider Tailscale ACLs for test-specific access
3. Mount shared folders for test artifacts via Tailscale
4. Use Tailscale subnet routing for accessing test services

### Latency Impact:

- Tailscale adds ~1-5ms latency (negligible for test distribution)
- WebSocket connections stable over Tailscale
- File transfer for reports: use rsync over Tailscale

---

## Alternative Patterns Worth Considering

### Hybrid Approach:

- Use sharding for regular tests
- Use browser servers for specific heavy tests
- Keep smoke tests on main machine only

### Progressive Distribution:

1. Start: All tests on main machine
2. Phase 1: 2-way sharding (main + 1 remote)
3. Phase 2: 4-way sharding (all machines)
4. Phase 3: Add workers per shard
5. Phase 4: Implement smart distribution

---

## Conclusion

For your specific use case with 4 Tailscale-connected machines and a Next.js blog, **native Playwright sharding is the clear winner**. It provides:

1. **Immediate 75% speed improvement** with minimal setup
2. **Zero additional costs** (using existing hardware)
3. **Official support** from Playwright team
4. **Simple maintenance** (just command-line flags)
5. **Perfect Tailscale integration** via SSH

Start with the basic sharding script (1-2 hours of work), measure improvements, then gradually add sophistication based on actual needs. The beauty of this approach is that you can be running distributed tests within an hour of setup, then iterate on the orchestration layer as needed.

The investment in setting up distributed testing will pay off immediately in faster feedback cycles, especially as you implement TDD across accessibility, Lighthouse, and E2E tests for multiple viewports and themes.
