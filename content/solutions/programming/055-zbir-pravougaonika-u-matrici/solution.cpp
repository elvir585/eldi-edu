#include <bits/stdc++.h>
using namespace std;
int main() {
    int R, C, Q;
    cin >> R >> C >> Q;
    vector < vector < long long >> P(R + 1, vector < long long > (C + 1));
    for (int r = 1; r <= R;++ r) for (int c = 1; c <= C;++ c) {
        long long x;
        cin >> x;
        P [r] [c] = x + P [r - 1] [c] + P [r] [c - 1] - P [r - 1] [c - 1];
    }
    while (Q--) {
        int r1, c1, r2, c2;
        cin >> r1 >> c1 >> r2 >> c2;
        cout << P [r2] [c2] - P [r1 - 1] [c2] - P [r2] [c1 - 1] + P [r1 -
            1] [c1 - 1]
            << "\n";
    }
}
