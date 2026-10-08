#include <bits/stdc++.h>
using namespace std;
int main() {
    long long s [3], p;
    cin >> s [0] >> s [1] >> s [2] >> p;
    for (long long kap : s) {
        long long uzmi = min(kap, p);
        cout << uzmi << '\n';
        p -= uzmi;
    }
}
