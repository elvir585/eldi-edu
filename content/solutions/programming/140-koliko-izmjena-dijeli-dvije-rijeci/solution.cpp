#include <bits/stdc++.h>
using namespace std;
int main() {
    string A, B;
    getline(cin, A);
    getline(cin, B);
    vector < int > prev(B.size() + 1), cur(B.size() + 1);
    iota(prev.begin(), prev.end(), 0);
    for (int i = 1; i <= (int) A.size();++ i) {
        cur [0] = i;
        for (int j = 1; j <= (int) B.size();++ j) cur [j] = min({
            prev [j] + 1, cur [j - 1] + 1, prev [j - 1] + (A [i - 1] != B
                [j - 1])
        }
        );
        swap(prev, cur);
    }
    cout << prev [B.size()] << "\n";
}
