import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MovementsComponent } from "./movement.component";

const routes: Routes = [
    { path: '', component: MovementsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MovementsRoutingModule { }