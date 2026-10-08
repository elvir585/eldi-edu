#include <bits/stdc++.h>
using namespace std;
vector < long long > makeSums(const vector < long long > & a) {
    vector < long long > r {
        0
    }
    ;
    for (long long x : a) {
        int sz = r.size();
        for (int i = 0; i < sz;++ i) r.push_back(r [i] + x);
    }
    return r;
}
int main() {
    int N;
    long long S;
    cin >> N >> S;
    vector < long long > A(N);
    for (auto & x : A) cin >> x;
    int m = N / 2;
    vector < long long > L(A.begin(), A.begin() + m), Rpart(A.begin() + m,
        A.end());
    auto X = makeSums(L), Y = makeSums(Rpart);
    sort(Y.begin(), Y.end());
    for (long long x : X) if (binary_search(Y.begin(), Y.end(), S - x)) {
        cout << "DA\n";
        return 0;
    }
    cout << "NE\n";
}
