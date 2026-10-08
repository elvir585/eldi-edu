#include <bits/stdc++.h>
using namespace std;
int main() {
    int N;
    cin >> N;
    vector < long long > st;
    long long sum = 0;
    while (N--) {
        long long x;
        cin >> x;
        if (x != 0) {
            st.push_back(x);
            sum += x;
        }
        else if (! st.empty()) {
            sum -= st.back();
            st.pop_back();
        }
    }
    cout << sum << "\n";
}
