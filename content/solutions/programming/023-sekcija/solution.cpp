#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, broj = 0;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        if (s [5] >= '4' && s [8] == '5') broj++;
    }
    cout << broj << '\n';
}
