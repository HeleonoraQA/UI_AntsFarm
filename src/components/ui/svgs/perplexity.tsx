import type { SVGProps } from 'react'

export const Perplexity = (props: SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill="currentColor"
            d="M12 1.5 3.75 7.5v9L12 22.5l8.25-6v-9L12 1.5Zm0 2.3 5.9 4.3-5.9 4.3-5.9-4.3 5.9-4.3ZM5.75 9.5l5.15 3.75v7.45L5.75 16.9V9.5Zm7.35 11.2v-7.45l5.15-3.75v7.4l-5.15 3.8Z"
        />
    </svg>
)
