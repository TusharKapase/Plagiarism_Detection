import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import gmean

def compute_record_breaks(num_trials, array_len):
    change_list = []
    for _ in range(num_trials):
        random_values = np.random.random(array_len)
        current_min = float('inf')
        changes = 0
        for val in random_values:
            if val < current_min:
                current_min = val
                changes += 1
        change_list.append(changes)

    avg = np.mean(change_list)
    med = np.median(change_list)
    geo = gmean(change_list)

    plt.hist(change_list, bins=20, color='salmon', edgecolor='black', alpha=0.8)
    plt.title(f"Record Changes Distribution (Size = {array_len})")
    plt.xlabel("Number of Record Minimums")
    plt.ylabel("Trial Frequency")
    plt.grid(True, linestyle='--', alpha=0.5)
    plt.tight_layout()
    plt.show()

    print(f"[Array Size: {array_len}] → Avg = {avg:.2f}, Median = {med}, Geo Mean = {geo:.2f}")
    return avg

sizes_to_test = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000,
                 10000, 20000, 50000, 100000, 200000, 500000, 1000000]
trial_runs = 100
average_results = []

for size in sizes_to_test:
    avg_result = compute_record_breaks(trial_runs, size)
    average_results.append(avg_result)

plt.figure(figsize=(10, 6))
plt.plot(sizes_to_test, average_results, marker='D', linestyle='-', color='darkcyan')
plt.xscale('log')
plt.xlabel("Input Size (N) [log scale]")
plt.ylabel("Average Record Count")
plt.title("Log Plot: Array Size vs Average Record-Breaking Count")
plt.grid(True, alpha=0.4, linestyle=':')
plt.tight_layout()
plt.show()