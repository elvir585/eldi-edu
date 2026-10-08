#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, r1, r2;
    cin >> s >> r1 >> r2;
    for (string r : {
        r1, r2
    }
    ) {
        string ostatak = s;
        for (char c : r) {
            size_t p = ostatak.find(c);
            ostatak.erase(p, 1);
        }
        cout << ostatak << '\n';
    }
}
