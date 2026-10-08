#include <bits/stdc++.h>
using namespace std;
int main() {
    long long h1, m1, s1, h2, m2, s2;
    cin >> h1 >> m1 >> s1 >> h2 >> m2 >> s2;
    long long t1 = 3600 * h1 + 60 * m1 + s1;
    long long t2 = 3600 * h2 + 60 * m2 + s2;
    cout << t2 - t1 << '\n';
}
