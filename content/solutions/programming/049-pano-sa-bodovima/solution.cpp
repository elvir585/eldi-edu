#include <iostream>
#include <vector>
using namespace std;
int main() {
    int R, C, Q;
    cin >> R >> C >> Q;
    vector < vector < long long >> p(R + 1, vector < long long > (C + 1, 0));
    for (int i = 1; i <= R; i++) for (int j = 1; j <= C; j++) {
        long long x;
        cin >> x;
        p [i] [j] = x + p [i - 1] [j] + p [i] [j - 1] - p [i - 1] [j - 1];
    }
    while (Q--) {
        int r1, c1, r2, c2;
        cin >> r1 >> c1 >> r2 >> c2;
        cout << p [r2] [c2] - p [r1 - 1] [c2] - p [r2] [c1 - 1] + p [r1 -
            1] [c1 - 1]
            << "\n";
    }
}
