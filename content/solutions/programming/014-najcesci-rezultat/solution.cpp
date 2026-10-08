#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    unordered_map < long long, int > c;
    while (n--) {
        long long x;
        cin >> x;
        c [x]++;
    }
    long long best = 0;
    int bf = - 1;
    bool first = true;
    for (auto [x, f] : c) {
        if (first || f > bf || (f == bf && x < best)) {
            first = false;
            bf = f;
            best = x;
        }
    }
    cout << best << "\n";
}
