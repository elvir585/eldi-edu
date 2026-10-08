#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, K;
    cin >> N >> K;
    vector < long long > a(2 * N);
    for (int i = 0; i < N; i++) {
        cin >> a [i];
        a [i + N] = a [i];
    }
    long long cur = 0;
    for (int i = 0; i < K; i++) cur += a [i];
    long long best = cur;
    for (int s = 1; s < N; s++) {
        cur += a [s + K - 1] - a [s - 1];
        best = max(best, cur);
    }
    cout << best << "\n";
}
