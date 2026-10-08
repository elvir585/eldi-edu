#include <bits/stdc++.h>
using namespace std;
int main() {
    int R, C, Q;
    cin >> R >> C >> Q;
    vector < vector < long long >> p(R + 1, vector < long long > (C + 1));
    for (int r = 1; r <= R; r++) for (int c = 1; c <= C; c++) {
        long long x;
        cin >> x;
        p [r] [c] = x + p [r - 1] [c] + p [r] [c - 1] - p [r - 1] [c - 1];
    }
    while (Q--) {
        int r1, c1, r2, c2;
        cin >> r1 >> c1 >> r2 >> c2;
        cout << p [r2] [c2] - p [r1 - 1] [c2] - p [r2] [c1 - 1] + p [r1 -
            1] [c1 - 1]
            << "\n";
    }
}
