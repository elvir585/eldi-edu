#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < int > a(n);
    int tot = 0;
    for (int & x : a) {
        cin >> x;
        tot += x;
    }
    if (tot & 1) {
        cout << "NE\n";
        return 0;
    }
    int T = tot / 2;
    vector < char > d(T + 1);
    d [0] = 1;
    for (int x : a) for (int s = T; s >= x; s--) d [s] = d [s] || d [s - x];
    cout << (d [T] ? "DA" : "NE") << "\n";
}
