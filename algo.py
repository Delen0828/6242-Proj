import numpy as np
import json
# import matplotlib.pyplot as plt


def UCB_sim(T=500, N=5):
    # Declerations
    mu_i = np.arange(0, 1, 0.2).reshape((N))
    mu_i_hat = np.ones_like(mu_i)
    T_ij = np.ones_like(mu_i)
    # reg = []
    action = []
    # Each round update estimated mean mu_i and upper bound mu_i_hat
    for t in range(T):
        rho_ij = np.sqrt(3*np.log(t+1)/(2*T_ij))
        mu_i_bar = np.minimum(mu_i_hat + rho_ij, 1)
        i_t = int(np.unravel_index(np.argmax(mu_i_bar, axis=None), mu_i_bar.shape)[0])
        # print(i_t)
        T_ij[i_t] += 1
        X_ij = (np.random.rand() < mu_i[i_t]) * 1
        mu_i_hat[i_t] += (X_ij - mu_i_hat[i_t]) / T_ij[i_t]
        # reg.append(opt-mu_i[i_t])
        action.append(i_t)
    return json.dumps(action)

# if __name__ == '__main__':
#     UCB_sim(T=10)