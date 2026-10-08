#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long p2 = 0, p1 = 0;
    while (n--) {
        long long x;
        cin >> x;
        long long nw = max(p1, p2 + x);
        p2 = p1;
        p1 = nw;
    }
    cout << p1 << "\n";
}
