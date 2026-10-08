#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    vector < int > a(q);
    int M = 0;
    for (int & x : a) {
        cin >> x;
        M = max(M, x);
    }
    vector < char > p(M + 1, 1);
    if (M >= 0) p [0] = 0;
    if (M >= 1) p [1] = 0;
    for (long long i = 2; i * i <= M; i++) if (p [i]) for (long long j = i
        * i; j <=
        M; j += i) p [j] = 0;
    vector < int > pref(M + 1);
    for (int i = 1; i <= M; i++) pref [i] = pref [i - 1] + p [i];
    for (int x : a) cout << pref [x] << "\n";
}
