#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < vector < int >> a(n, vector < int > (n));
    for (auto & r : a) for (int & x : r) cin >> x;
    bool ok = true;
    for (int i = 0; i < n; i++) {
        vector < char > seen(n + 1, 0);
        for (int j = 0; j < n; j++) if (a [i] [j]) {
            if (seen [a [i] [j]]) ok = false;
            seen [a [i] [j]] = 1;
        }
    }
    for (int j = 0; j < n; j++) {
        vector < char > seen(n + 1, 0);
        for (int i = 0; i < n; i++) if (a [i] [j]) {
            if (seen [a [i] [j]]) ok = false;
            seen [a [i] [j]] = 1;
        }
    }
    cout << (ok ? "OK" : "GRESKA") << "\n";
}
