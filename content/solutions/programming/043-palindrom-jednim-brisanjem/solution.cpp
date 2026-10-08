#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    auto pal = [&] (int l, int r) {
        while (l < r) {
            if (s [l] != s [r]) return false;
            l++;
            r--;
        }
        return true;
    }
    ;
    int l = 0, r = (int) s.size() - 1;
    while (l < r && s [l] == s [r]) {
        l++;
        r--;
    }
    cout << ((l >= r || pal(l + 1, r) || pal(l, r - 1)) ? "DA" : "NE") << "\n";
}
