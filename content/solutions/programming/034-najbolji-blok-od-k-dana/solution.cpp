#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, K;
    cin >> N >> K;
    vector < long long > A(N);
    for (auto & x : A) cin >> x;
    long long cur = 0;
    for (int i = 0; i < K;++ i) cur += A [i];
    long long best = cur;
    for (int i = K; i < N;++ i) {
        cur += A [i] - A [i - K];
        best = max(best, cur);
    }
    cout << best << "\n";
}
