#include <bits/stdc++.h>
using namespace std;
int main() {
    int N;
    cin >> N;
    vector < long long > st;
    string t;
    while (N--) {
        cin >> t;
        if (t == "+" || t == "-" || t == "*") {
            long long b = st.back();
            st.pop_back();
            long long a = st.back();
            st.pop_back();
            st.push_back(t == "+" ? a + b : t == "-" ? a - b : a * b);
        }
        else st.push_back(stoll(t));
    }
    cout << st.back() << "\n";
}
