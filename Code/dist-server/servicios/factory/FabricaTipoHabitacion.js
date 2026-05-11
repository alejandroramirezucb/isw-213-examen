"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FabricaTipoHabitacion = void 0;
const HabitacionSimple_1 = require("../estrategy/HabitacionSimple");
const HabitacionSuite_1 = require("../estrategy/HabitacionSuite");
const HabitacionDobleIndividual_1 = require("../estrategy/HabitacionDobleIndividual");
const HabitacionDobleMatrimonial_1 = require("../estrategy/HabitacionDobleMatrimonial");
class FabricaTipoHabitacion {
    static estrategias = {
        'Simple': new HabitacionSimple_1.HabitacionSimple(),
        'Suite': new HabitacionSuite_1.HabitacionSuite(),
        'Doble Individual': new HabitacionDobleIndividual_1.HabitacionDobleIndividual(),
        'Doble Matrimonial': new HabitacionDobleMatrimonial_1.HabitacionDobleMatrimonial(),
    };
    static crear(nombre) {
        const estrategia = FabricaTipoHabitacion.estrategias[nombre];
        if (!estrategia) {
            return null;
        }
        return estrategia.crear();
    }
}
exports.FabricaTipoHabitacion = FabricaTipoHabitacion;
