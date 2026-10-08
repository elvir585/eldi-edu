#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    int ans = 0;
    for (int i = 0; i < 6; i++) ans += (s [i] - '0') * (i + 1);
    cout << ans % 11 << "\n";
}
