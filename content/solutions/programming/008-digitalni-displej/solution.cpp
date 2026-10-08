#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
int main() {
    string s;
    cin >> s;
    bool ok = true;
    for (char c : s) if (c != '0' && c != '1' && c != '8') ok = false;
    for (int i = 0, j = (int) s.size() - 1; i < j; i++, j--) if (s [i] != s
        [j]) ok =
        false;
    cout << (ok ? "DA" : "NE") << "\n";
}
