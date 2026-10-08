#include <iostream>
#include <array>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    array < int, 4 > cnt {
    }
    ;
    for (int i = 0; i < n; i++) {
        char c;
        cin >> c;
        cnt [c - 'A']++;
    }
    int m = * max_element(cnt.begin(), cnt.end());
    int who = - 1, k = 0;
    for (int i = 0; i < 4; i++) if (cnt [i] == m) {
        who = i;
        k++;
    }
    if (k == 1) cout << char('A' + who) << "\n";
    else cout << "NEMA\n";
}
