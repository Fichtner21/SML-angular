import { Directive, Input, ElementRef, Renderer2, OnChanges, SimpleChanges } from "@angular/core";

@Directive({
  selector : '[app-srcdoc]'
})
export class SrcdocDirective implements OnChanges{
  // add data binding to directive itself
  @Input("app-srcdoc") source:string;
 
  constructor(private elementRef:ElementRef,private renderer:Renderer2) {}

  // update the srcdoc attribute whenever the binding changes
  ngOnChanges(changes: SimpleChanges): void {
    this.renderer.setAttribute(this.elementRef.nativeElement,"srcdoc",changes.source.currentValue);
  }

}