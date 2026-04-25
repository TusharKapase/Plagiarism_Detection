import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import random
arr=[10, 20, 50, 100, 200, 500, 1000, 2000,
5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000]
def min_var_change_count(k=100,N=100):
      var_change_counts=[]
      for i in range(k):
            arr=np.random.rand(N)
            temp_min=float('inf')
            var_change=0
            i=0
            while i<len(arr):
                  if temp_min>arr[i]:
                        temp_min=arr[i]
                        var_change+=1
                  i+=1
            
            var_change_counts.append(var_change)

      
      plt.hist(var_change_counts,edgecolor="black")
      plt.xlabel("x-axis")
      plt.ylabel("y-axis")
      plt.show()

      mean_value=np.mean(var_change_counts)
      return mean_value


N_arr=[10, 20, 50, 100, 200, 500, 1000, 2000,
5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000]

mean_arr=[]

for N in N_arr:
      mean=min_var_change_count(k=100,N=N)
      mean_arr.append(mean)



plt.figure(figsize=(10, 6))
plt.plot(N_arr, mean_arr, marker='o')
plt.xscale('log')
plt.xlabel("Array Size N (log scale)")
plt.ylabel("Mean of var_change_count")
plt.title("N vs Mean of var_change_count")
plt.grid(True)
plt.show()







