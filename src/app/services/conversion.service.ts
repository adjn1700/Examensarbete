import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class ConversionService {
// Author: Arnold Andreasson, info@mellifica.se
// Copyright (c) 2007-2016 Arnold Andreasson
// License: MIT License as follows:
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// =============================================================================
// Javascript-implementation of "Gauss Conformal Projection
// (Transverse Mercator), Krügers Formulas".
// - Parameters for SWEREF99 lat-long to/from RT90 and SWEREF99
//   coordinates (RT90 and SWEREF99 are used in Swedish maps).
// Source: http://www.lantmateriet.se/geodesi/

    private axis = 6378137.0; // Semi-major axis of the ellipsoid.
    private flattening = 1.0 / 298.257222101; // Flattening of the ellipsoid.
    private central_meridian = 15.00; // Central meridian for the projection.
    private lat_of_origin = 0.0; // Latitude of origin.
    private scale = 0.9996; // Scale on central meridian.
    private false_northing = 0.0; // Offset for origo.
    private false_easting = 500000.0; // Offset for origo.

    constructor(){
    }

    convertWgsToSweref(latitude, longitude) {
        var x_y = new Array(2);
        if (this.central_meridian == null) {
            return x_y;
        }
        // Prepare ellipsoid-based stuff.
        var e2 = this.flattening * (2.0 - this.flattening);
        var n = this.flattening / (2.0 - this.flattening);
        var a_roof = this.axis / (1.0 + n) * (1.0 + n*n/4.0 + n*n*n*n/64.0);
        var A = e2;
        var B = (5.0*e2*e2 - e2*e2*e2) / 6.0;
        var C = (104.0*e2*e2*e2 - 45.0*e2*e2*e2*e2) / 120.0;
        var D = (1237.0*e2*e2*e2*e2) / 1260.0;
        var beta1 = n/2.0 - 2.0*n*n/3.0 + 5.0*n*n*n/16.0 + 41.0*n*n*n*n/180.0;
        var beta2 = 13.0*n*n/48.0 - 3.0*n*n*n/5.0 + 557.0*n*n*n*n/1440.0;
        var beta3 = 61.0*n*n*n/240.0 - 103.0*n*n*n*n/140.0;
        var beta4 = 49561.0*n*n*n*n/161280.0;

        // Convert.
        var deg_to_rad = Math.PI / 180.0;
        var phi = latitude * deg_to_rad;
        var lambda = longitude * deg_to_rad;
        var lambda_zero = this.central_meridian * deg_to_rad;

        var phi_star = phi - Math.sin(phi) * Math.cos(phi) * (A +
                        B*Math.pow(Math.sin(phi), 2) +
                        C*Math.pow(Math.sin(phi), 4) +
                        D*Math.pow(Math.sin(phi), 6));
        var delta_lambda = lambda - lambda_zero;
        var xi_prim = Math.atan(Math.tan(phi_star) / Math.cos(delta_lambda));
        var eta_prim = this.math_atanh(Math.cos(phi_star) * Math.sin(delta_lambda));
        var x = this.scale * a_roof * (xi_prim +
                        beta1 * Math.sin(2.0*xi_prim) * this.math_cosh(2.0*eta_prim) +
                        beta2 * Math.sin(4.0*xi_prim) * this.math_cosh(4.0*eta_prim) +
                        beta3 * Math.sin(6.0*xi_prim) * this.math_cosh(6.0*eta_prim) +
                        beta4 * Math.sin(8.0*xi_prim) * this.math_cosh(8.0*eta_prim)) +
                        this.false_northing;
        var y = this.scale * a_roof * (eta_prim +
                        beta1 * Math.cos(2.0*xi_prim) * this.math_sinh(2.0*eta_prim) +
                        beta2 * Math.cos(4.0*xi_prim) * this.math_sinh(4.0*eta_prim) +
                        beta3 * Math.cos(6.0*xi_prim) * this.math_sinh(6.0*eta_prim) +
                        beta4 * Math.cos(8.0*xi_prim) * this.math_sinh(8.0*eta_prim)) +
                        this.false_easting;
        x_y[0] = Math.round(x * 1000.0) / 1000.0;
        x_y[1] = Math.round(y * 1000.0) / 1000.0;
    //	x_y[0] = x;
    //	x_y[1] = y;
            console.log(x_y[0]);
            console.log(x_y[1]);
        return x_y;
    }




    // Missing functions in the Math library.
    math_sinh(value) {
        return 0.5 * (Math.exp(value) - Math.exp(-value));
    }
    math_cosh(value) {
        return 0.5 * (Math.exp(value) + Math.exp(-value));
    }
    math_atanh(value) {
        return 0.5 * Math.log((1.0 + value) / (1.0 - value));
    }
}
