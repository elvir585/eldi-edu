#include <bits/stdc++.h>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    vector < int > p(b.size() + 1), c(b.size() + 1);
    for (char x : a) {
        fill(c.begin(), c.end(), 0);
        for (int j = 1; j <= (int) b.size(); j++) c [j] = (x == b [j - 1] ?
            p [j - 1]
            + 1 : max(p [j], c [j - 1]));
        swap(p, c);
    }
    cout << p.back() << "\n";
}
