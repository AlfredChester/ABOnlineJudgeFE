/**
 * @file        fft-mult-extension.h
 * @author      Dr.Alfred (abonlinejudge@163.com)
 * @brief       FFT multiplication extension for highInt
 * @version     0.1 (Unfinished)
 * @date        2023-01-23
 * 
 * @copyright   Copyright (c) 2019-2022 <Rhodes Island Inc.>
 * 
 */

#include <cmath>    // maths lib
#include <complex>  // complex number
#include <deque>    // base_type

const double pi = acos(-1);

typedef unsigned char               _deque_vTp;
typedef std::deque<_deque_vTp>      api_type;
typedef std::complex<double>        Complex;

#ifndef _FFT_EXTENSION_H_
#define _FFT_EXTENSION_H_
namespace FFT_Extension {
    long long limit, index;
    std::deque<Complex> a, b;       // 两个复数容器
    inline api_type fft_mult_api(api_type num1, api_type num2) {
        const size_t n = num1.size() - 1, m = num2.size() - 1;
        a.clear(), b.clear(), a.resize(n + 1), b.resize(m + 1);
        for (int i = 0; i <= n; i++) {
            a[n - i].real = num1[i];
        }
        for (int i = 0; i <= m; i++) {
            b[m - i].real = num2[i];
        }
        limit = 1, index = 0;
        while (limit <= n + m) {
            limit <<= 1, ++index;
        }
        for (long long i = 0; i < limit; i++) {
        }
        static api_type __retval;
    }
}
#endif
