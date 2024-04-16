import {createRouter, createWebHistory} from "vue-router";
import ProductsTable from "@/components/ProductsTable.vue";
import UserCart from "@/components/UserCart.vue";
import ErrorForm from "@/components/ErrorForm.vue";

const routes = [
    {
        path: '/',
        components:
            {
                default: ProductsTable,
                additional: ErrorForm,
            },
    },
    {
        path: '/cart/:order',
        components:
            {
                default: UserCart,
                additional: ErrorForm,
            },
        props: true,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;