#!/bin/bash


function copy_file(){
    relpath="$(dirname $file)";
    tarpath="build/${relpath}";
    if [ ! -d $tarpath ]; then
      mkdir -p "$tarpath"    
    fi
    cp $file $tarpath
}


mkdir -p build/server

for file in $(find server -type f); do
    case $file in
    *.env|*.ejs) # has a extension
      copy_file $file;
      ;;
    esac
done