#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    int cur = 1, best = 1;
    for (int i = 1; i < (int) s.size();++ i) {
        cur = (s [i] == s [i - 1] ? cur + 1 : 1);
        best = max(best, cur);
    }
    cout << best << "\n";
}
