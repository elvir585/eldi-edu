#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, Q;
    cin >> N >> Q;
    vector < bool > prime(N + 1, true);
    prime [0] = prime [1] = false;
    for (long long p = 2; p * p <= N;++ p) if (prime [p]) for (long long x
        = p * p; x
        <= N; x += p) prime [x] = false;
    while (Q--) {
        int x;
        cin >> x;
        cout << (prime [x] ? "DA" : "NE") << "\n";
    }
}
