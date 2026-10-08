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
    vector < char > r(tot + 1);
    r [0] = 1;
    for (int x : a) for (int s = tot; s >= x; s--) if (r [s - x]) r [s] = 1;
    for (int s = tot / 2; s >= 0; s--) if (r [s]) {
        cout << tot - 2 * s << "\n";
        break;
    }
}
