#include <bits/stdc++.h>
using namespace std;
int main() {
    int N;
    cin >> N;
    vector < long long > A(N), ans(N, - 1);
    for (auto & x : A) cin >> x;
    vector < int > st;
    for (int i = 0; i < N;++ i) {
        while (! st.empty() && A [st.back()] < A [i]) {
            ans [st.back()] = A [i];
            st.pop_back();
        }
        st.push_back(i);
    }
    for (int i = 0; i < N;++ i) {
        if (i) cout << ' ';
        cout << ans [i];
    }
    cout << "\n";
}
