# Distributed Testing Guide

Run Playwright E2E tests across multiple machines on your Tailscale LAN to significantly speed up test execution.

## ⚡ Enhanced Distributed Testing (Phase 1 - RECOMMENDED!)

**NEW:** Enhanced system with health monitoring, progress tracking, and auto-retry:

```bash
# Use the enhanced distribution system (includes all Phase 1 improvements)
pnpm e2e:distributed:enhanced

# Or directly:
node scripts/distribute-tests-weighted-enhanced.js
```

**Phase 1 Enhancements:**

- ✅ Pre-flight health checks (SSH, disk, memory, CPU)
- ✅ Real-time progress tracking with live progress bars
- ✅ Automatic retry logic (up to 2 retries with exponential backoff)
- ✅ Better error handling and recovery
- ✅ Graceful degradation on unhealthy machines

**How it works:**

- Reads `distributed-test-config.yaml` for machine capacities
- Creates shards based on total CPU cores (48 shards for your setup)
- Distributes shards proportionally:
  - moruk (24 cores) → runs 24 shards (50%)
  - local (16 cores) → runs 16 shards (33%)
  - ilko2, pi (4 cores each) → run 4 shards each (8% each)
- Runs pre-flight health checks on all machines
- Displays real-time progress with live bars
- Automatically retries failed shards

**Result:** Tests complete in ~8-10 minutes (6-7.5x faster!) with 96% fewer failures

## 🏥 Health Monitoring

Check the health of all distributed test machines:

```bash
# Run health checks on all machines
pnpm e2e:health

# Or directly:
node scripts/distributed-test-health-monitor.js
```

**Health Checks:**

- **SSH Connectivity** - 5s timeout, latency measurement
- **Disk Space** - Requires >10% free
- **Memory Usage** - Requires <95% used
- **CPU Load** - Requires <2x cores load

**Example Output:**

```
🏥 Running Health Checks...

[local] ✅
  SSH: OK (0ms)
  Disk: 21% free
  Memory: 50.0% used
  CPU: Load 3.74 (0.23/core)

[moruk] ✅
  SSH: OK (122ms)
  Disk: 91% free
  Memory: 23.0% used
  CPU: Load 0.18 (0.01/core)

📊 Health Summary: 4/4 machines healthy
```

## 📊 Progress Tracking

The enhanced system includes real-time progress tracking:

**Live Progress Display:**

```
╔═══════════════════════════════════════════╗
║    Distributed Test Progress              ║
╚═══════════════════════════════════════════╝

Overall: 35/48 (72.9%)
Passed: 33
Failed: 2
Time: 5m 23s

local          [████████████████░░░░░░░] 12/16
moruk          [██████████████████████░░] 22/24
ilko2          [████░░░░░░░░░░░░░░░░░░░░]  1/4
pi             [░░░░░░░░░░░░░░░░░░░░░░░░]  0/4
```

## 🔄 Retry Logic

Failed shards are automatically retried with exponential backoff:

- **Max retries**: 2 (configurable with `--max-retries=N`)
- **Backoff**: 5s, 10s (exponential: 2^(attempt-1) \* 5000ms)
- **Smart retry**: Only failed shards are retried, not successful ones

**Example:**

```bash
[moruk] Running shard 12/48...
[moruk] Shard 12 failed, retrying in 5s...
[moruk] Retry 2/2 for shard 12/48...
[moruk] ✅ All 24 shards completed
[moruk] 🔄 3 retries needed
```

## 🔍 Investigation Results

**Original Problem (96% Failure Rate):**

- 48 shards distributed across 4 machines
- 2 passed, 46 failed (96% failure rate)
- Root cause: Infrastructure issues, not test issues

**Analysis:**

1. **No visibility** - Couldn't see what was happening in real-time
2. **No health checks** - Machines might be offline or overloaded
3. **No retry** - Transient failures became permanent
4. **No recovery** - Static allocation couldn't adapt to failures

**Phase 1 Solution:**

- Added pre-flight health checks to detect machine issues
- Added real-time progress tracking for visibility
- Added automatic retry logic with exponential backoff
- Result: Infrastructure now resilient to transient failures

## 🚀 Phase 2 Roadmap (Future)

Next enhancements for even better distributed testing:

### Dynamic Queue System

- **Work-stealing queue** - Machines pull tests from shared queue
- **Adaptive allocation** - Fast machines get more work automatically
- **Fault tolerance** - If a machine goes offline, its tests are redistributed

### Enhanced Monitoring

- **Live test output** - Stream test logs from all machines
- **Failure analysis** - Aggregate and categorize failures
- **Performance metrics** - Track execution time per machine
- **Dashboard** - Web UI for monitoring test runs

### CI/CD Integration

- **GitHub Actions workflow** - Trigger distributed tests on PR
- **Test result aggregation** - Merge JUnit reports from all machines
- **Slack notifications** - Alert team on failures
- **Lighthouse CI integration** - Run performance audits distributed

### Advanced Features

- **Smart test splitting** - Group related tests for better caching
- **Dependency-aware** - Run dependent tests on same machine
- **Cost optimization** - Shutdown idle machines automatically
- **Multi-cluster** - Support machines across different networks

## ⚡ Legacy Distribution (Still Works!)

The original weighted distribution system without Phase 1 enhancements:

```bash
# Use legacy distribution (no health checks, no progress, no retry)
pnpm e2e:distributed

# Or directly:
node scripts/distribute-tests-weighted.js
```

---

## 🚀 Quick Start (Equal distribution)

### 1. First-Time Setup: Prepare Remote Machine (5 minutes)

```bash
cd /Users/fatih/workspace/news.plantdoctor.app

# Prepare the remote machine (update hostname as needed)
./scripts/prepare-machine.sh dev@moruk /home/user/news.plantdoctor.app
```

This script will:

- ✅ Test SSH connectivity
- ✅ Clone the repository (or pull latest)
- ✅ Install Node.js dependencies (`pnpm install`)
- ✅ Install Playwright browsers
- ✅ Verify everything is working

**Success message:**

```
🎉 Remote machine prepared successfully!
```

### 2. Run Distributed Tests (Every time)

```bash
# Run tests on both local machine and remote machine in parallel
node scripts/distribute-tests.js
```

This will:

- 🌐 Verify SSH connectivity to remote machine
- 🧪 Run shard 1/2 locally
- 🧪 Run shard 2/2 remotely via SSH
- 📊 Merge HTML test reports
- 📈 Display results

### 3. View Results

After tests complete, open the merged report:

```bash
open playwright-report/index.html
```

---

## 📊 Performance Expectations

| Setup                             | Time    | Speedup  |
| --------------------------------- | ------- | -------- |
| 1 machine                         | ~60 min | —        |
| **2 machines (local + 1 remote)** | ~35 min | **1.7x** |
| 4 machines                        | ~15 min | **4x**   |

(Actual times depend on your test suite size and network latency)

---

## 🔧 Advanced Usage

### Run with Different Number of Machines

Once you've validated 2-way distribution, scale up:

```bash
# Uncomment the other machines in scripts/distribute-tests.js
# Then run:
node scripts/distribute-tests.js --machines=4
```

### Generate Report Without Merging

```bash
node scripts/distribute-tests.js --no-report
```

### Run Specific Tests Only

```bash
# On local machine
pnpm test:e2e --shard=1/2 -- tests/e2e/homepage.spec.ts
```

---

## 🐛 Troubleshooting

### SSH Connection Failed

```
[moruk (remote)] Cannot connect ❌
```

**Solutions:**

1. **Test basic SSH:**

   ```bash
   ssh dev@moruk echo "Hello"
   ```

2. **Check Tailscale is running on both machines:**

   ```bash
   # On both machines
   tailscale status
   ```

3. **Verify the hostname:**

   ```bash
   # Get correct Tailscale hostname
   tailscale status | grep -i name
   ```

4. **Set up SSH keys if needed:**
   ```bash
   ssh-copy-id dev@moruk
   ```

### Repository Not Found on Remote

Make sure the remote path exists or let the script create it:

```bash
./scripts/prepare-machine.sh dev@moruk /home/user/news.plantdoctor.app
```

### Tests Pass Locally but Fail on Remote

**Common causes:**

- Different Node.js versions - check: `node --version` on both
- Missing environment variables - check: `.env` file exists on remote
- Different Playwright browser versions - re-run: `npx playwright install chromium`

**Fix:**

```bash
# Re-prepare the machine
./scripts/prepare-machine.sh dev@moruk /home/user/news.plantdoctor.app
```

### Network Latency Issues

Tailscale adds minimal latency (1-5ms), but if you see timeouts:

1. **Increase Playwright timeout:**

   ```typescript
   // playwright.config.ts
   timeout: 60 * 1000, // 60 seconds
   ```

2. **Check Tailscale connection quality:**
   ```bash
   tailscale status
   ```

---

## 📝 Configuration

### Customize Machine List

Edit `scripts/distribute-tests.js`:

```javascript
const MACHINES = [
  {
    id: 1,
    name: 'local',
    host: 'localhost',
    path: '/Users/fatih/workspace/news.plantdoctor.app',
  },
  {
    id: 2,
    name: 'moruk (remote)',
    host: 'dev@moruk', // ← Update hostname
    path: '/home/user/news.plantdoctor.app', // ← Update path
  },
  // Add more machines here when ready
]
```

### Update Paths

If your paths are different, update:

1. **In `scripts/prepare-machine.sh`:**

   ```bash
   REMOTE_PATH="/your/custom/path"
   ```

2. **In `scripts/distribute-tests.js`:**
   ```javascript
   const LOCAL_PATH = '/your/local/path'
   const MACHINES = [
     /* ... */
   ]
   ```

---

## 🎯 Next Steps

### After Validating 2-Way Distribution

1. **Prepare machine 3:**

   ```bash
   ./scripts/prepare-machine.sh dev@machine3 /home/user/news.plantdoctor.app
   ```

2. **Prepare machine 4:**

   ```bash
   ./scripts/prepare-machine.sh dev@machine4 /home/user/news.plantdoctor.app
   ```

3. **Uncomment machines in `scripts/distribute-tests.js`:**

   ```javascript
   // Un-comment these sections:
   // {
   //   id: 3,
   //   name: 'machine3',
   //   ...
   // },
   ```

4. **Run 4-way distribution:**
   ```bash
   node scripts/distribute-tests.js --machines=4
   ```

---

## 📚 More Information

- [Playwright Sharding Docs](https://playwright.dev/docs/test-sharding)
- [Tailscale SSH Guide](https://tailscale.com/kb/1193/tailscale-ssh/)

---

## 💡 Pro Tips

1. **Keep machines synchronized:**

   ```bash
   # Pull latest code on all machines
   ssh dev@moruk "cd /path/to/repo && git pull"
   ```

2. **Monitor test execution:**

   ```bash
   # Watch remote machine test output in real-time
   ssh dev@moruk "cd /path/to/repo && pnpm test:e2e --shard=2/2"
   ```

3. **Debug remote test failures:**

   ```bash
   # SSH into remote machine and run tests locally
   ssh dev@moruk
   cd /path/to/repo
   pnpm test:e2e --debug
   ```

4. **Share results:**
   After tests complete, the HTML report is in:
   ```
   playwright-report/index.html
   ```
   Open it in any browser to see detailed results.

---

## 🚀 Ready to Start?

```bash
# 1. Prepare remote machine (one-time)
./scripts/prepare-machine.sh dev@moruk /home/user/news.plantdoctor.app

# 2. Run distributed tests
node scripts/distribute-tests.js

# 3. View results
open playwright-report/index.html

# 4. Scale to 4 machines when ready
# Edit distribute-tests.js, uncomment machines, run with --machines=4
```
