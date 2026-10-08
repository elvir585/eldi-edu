#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;
struct T {
    string ime;
    int bod, kazna;
}
;
int main() {
    int n;
    cin >> n;
    vector < T > a(n);
    for (auto & x : a) cin >> x.ime >> x.bod >> x.kazna;
    sort(a.begin(), a.end(), [] (const T & x, const T & y) {
        if (x.bod != y.bod) return x.bod > y.bod; if (x.kazna != y.kazna)
            return
            x.kazna < y.kazna; return x.ime < y.ime;
    }
    );
    for (auto & x : a) cout << x.ime << "\n";
}
