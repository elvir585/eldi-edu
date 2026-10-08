#include <bits/stdc++.h>
using namespace std;
int main() {
    vector < int > a(8);
    for (int & x : a) cin >> x;
    int najbolje = 0;
    for (int p = 0; p < 8; p++) {
        int zbir = 0;
        for (int j = 0; j < 4; j++) zbir += a [(p + j) % 8];
        najbolje = max(najbolje, zbir);
    }
    cout << najbolje << '\n';
}
