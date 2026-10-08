#include <bits/stdc++.h>
using namespace std;
int main() {
    int R, C;
    cin >> R >> C;
    const long long NEG = - (1LL << 60);
    vector < long long > d(C + 1, NEG);
    d [1] = 0;
    for (int i = 0; i < R; i++) for (int j = 1; j <= C; j++) {
        long long x;
        cin >> x;
        d [j] = x + max(d [j], d [j - 1]);
    }
    cout << d [C] << "\n";
}
