#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    string s;
    cin >> s;
    vector < int > last(256, - 1);
    int l = 0, ans = 0;
    for (int r = 0; r < (int) s.size(); r++) {
        unsigned char c = s [r];
        if (last [c] >= l) l = last [c] + 1;
        last [c] = r;
        ans = max(ans, r - l + 1);
    }
    cout << ans << "\n";
}
