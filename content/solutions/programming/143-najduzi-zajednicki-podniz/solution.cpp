#include <bits/stdc++.h>
using namespace std;
int main() {
    string A, B;
    cin >> A >> B;
    if (B.size() > A.size()) swap(A, B);
    vector < int > p(B.size() + 1), c(B.size() + 1);
    for (char x : A) {
        fill(c.begin(), c.end(), 0);
        for (int j = 1; j <= (int) B.size(); j++) c [j] = (x == B [j - 1] ?
            p [j - 1]
            + 1 : max(p [j], c [j - 1]));
        swap(p, c);
    }
    cout << p.back() << "\n";
}
