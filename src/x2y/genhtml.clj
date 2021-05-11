(ns x2y.genhtml
  (:require [hiccup.core])
  (:require [ssg.core]))

(defn render-html []
  (ssg.core/render-pages "dist/"
    {"index.html"
      [:html
        [:head
          [:script { :src "utils.js" :type "text/javascript" }]]
        [:body
          [:h1 "X2Y Converter"]]]}))

(defn run [opts]
  (render-html))
